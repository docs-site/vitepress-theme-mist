import { computed, MaybeRefOrGetter, ref, toValue, watch } from "vue";
import { useScopeDispose } from "./useScopeDispose";

export interface TypesOption {
  /**
   * 打字间隔时间，单位：毫秒
   */
  inputTime?: number;
  /**
   * 删字间隔时间，单位：毫秒
   */
  outputTime?: number;
  /**
   * 获取新数据间隔时间，单位：毫秒
   */
  nextTime?: number;
  /**
   * 是否随机获取新数据
   */
  shuffle?: boolean;
  /**
   * data 发生变化，是否重新加载
   *
   * @default false
   */
  reloadWhenDataChanged?: boolean;
}

/**
 * 将文本按字素簇拆分为字符数组
 *
 * substring 按 UTF-16 编码单元截取，会把 emoji 等多码点字符截成一半而渲染出乱码，
 * 因此打字/删字均基于字素簇进行，优先使用 Intl.Segmenter，不支持时退化为按 Unicode 码点拆分
 */
const splitChars = (text: string): string[] => {
  const Segmenter = (Intl as any)?.Segmenter;
  if (typeof Segmenter === "function") {
    return Array.from(new Segmenter().segment(text), (s: any) => s.segment);
  }
  return Array.from(text);
};

/**
 * 打字功能
 *
 * @param data 数据
 * @param option 配置项
 */
export const useTextTypes = (data: MaybeRefOrGetter<string[]>, options: TypesOption = {}) => {
  const { inputTime = 200, outputTime = 100, nextTime = 800, shuffle = false, reloadWhenDataChanged = false } = options;
  const dataComputed = computed(() => toValue(data) || []);

  const text = ref("");
  const isFinished = ref(false);

  let originText = "";
  let originChars: string[] = [];
  let inputTimer: ReturnType<typeof setInterval> | null;
  let outputTimer: ReturnType<typeof setInterval> | null;
  // 为 originText 长度服务
  let textIndex = 0;
  // 为 dataComputed 下标服务
  let dataIndex = 0;

  const clearInputTimer = () => {
    if (inputTimer) {
      clearInterval(inputTimer);
      inputTimer = null;
    }
  };

  const clearOutputTimer = () => {
    if (outputTimer) {
      clearInterval(outputTimer);
      outputTimer = null;
    }
  };

  /**
   * 打字
   */
  const typesIn = () => {
    isFinished.value = false;
    originText = dataComputed.value[dataIndex];

    if (!originText) return stop();

    originChars = splitChars(originText);
    text.value = originChars.slice(0, textIndex++).join("");

    if (textIndex > originChars.length) {
      clearInputTimer();
      isFinished.value = true;
      setTimeout(() => {
        outputTimer = setInterval(() => {
          typesOut();
        }, outputTime);
      }, nextTime);
    }
  };
  /**
   * 删字
   */
  const typesOut = () => {
    if (textIndex >= 0) {
      isFinished.value = false;
      text.value = originChars.slice(0, textIndex--).join("");
    } else {
      clearOutputTimer();
      isFinished.value = true;

      setTimeout(() => {
        if (shuffle) {
          // 随机选择下一个文本
          let newIndex: number;
          do {
            newIndex = Math.floor(Math.random() * dataComputed.value.length);
          } while (newIndex === dataIndex);

          dataIndex = newIndex;
        } else {
          // 按顺序选择下一个文本
          dataIndex = (dataIndex + 1) % dataComputed.value.length;
        }

        // 删字结束后 textIndex 为 -1，需归零，避免新文案首次打字被 slice 截掉末尾字符
        textIndex = 0;

        inputTimer = setInterval(() => {
          typesIn();
        }, inputTime);
      }, nextTime);
    }
  };

  /**
   * 开始打字
   */
  const start = () => {
    isFinished.value = false;
    inputTimer = setInterval(() => {
      typesIn();
    }, inputTime);
  };

  /**
   * 停止打字
   *
   * @param restore 是否还原数据为开始状态
   */
  const stop = (restore = false) => {
    clearInputTimer();
    clearOutputTimer();
    isFinished.value = false;

    if (restore) {
      text.value = "";
      originText = "";
      originChars = [];
      textIndex = 0;
      dataIndex = 0;
    }
  };

  /**
   * 重启打字
   */
  const restart = () => {
    stop(true);
    start();
  };

  if (reloadWhenDataChanged) watch(dataComputed, () => restart());

  useScopeDispose(stop);

  return { text, isFinished, start, stop, restart };
};

export type UseTextTypesReturn = ReturnType<typeof useTextTypes>;
