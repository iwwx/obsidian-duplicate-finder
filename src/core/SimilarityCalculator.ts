/**
 * 相似度计算器 - 使用 Jaccard 相似度算法
 */
export class SimilarityCalculator {
  /**
   * 计算两个文本的 Jaccard 相似度
   * @returns 0-100 的相似度百分比
   */
  calculateSimilarity(text1: string, text2: string): number {
    // 长度预筛选：差异过大直接返回低相似度
    const lengthRatio = Math.min(text1.length, text2.length) /
                        Math.max(text1.length, text2.length);
    if (lengthRatio < 0.3) {
      return 0;
    }

    const tokens1 = this.tokenize(text1);
    const tokens2 = this.tokenize(text2);

    if (tokens1.size === 0 && tokens2.size === 0) {
      return 100;
    }

    if (tokens1.size === 0 || tokens2.size === 0) {
      return 0;
    }

    const intersection = this.getIntersectionSize(tokens1, tokens2);
    const union = tokens1.size + tokens2.size - intersection;

    if (union === 0) {
      return 100;
    }

    return Math.round((intersection / union) * 100);
  }

  /**
   * 分词
   */
  private tokenize(text: string): Set<string> {
    // 移除 Markdown 语法和图片链接
    const cleanText = text
      .replace(/```[\s\S]*?```/g, '') // 代码块
      .replace(/`[^`]*`/g, '') // 行内代码
      .replace(/!\[[^\]]*\]\(https?:\/\/[^)]*\)/g, '') // 图片链接（包括图床）
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 本地图片
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 普通链接（保留文本）
      .replace(/^#+\s*/gm, '') // 标题
      .replace(/[#*_~`\[\]()]/g, '') // Markdown 符号
      .toLowerCase();

    const tokens = new Set<string>();

    // 提取中文词（使用 bigram）
    const chineseChars = cleanText.match(/[\u4e00-\u9fa5]+/g) || [];
    for (const segment of chineseChars) {
      // 单字
      for (const char of segment) {
        tokens.add(char);
      }
      // Bigram
      for (let i = 0; i < segment.length - 1; i++) {
        tokens.add(segment.slice(i, i + 2));
      }
    }

    // 提取英文词
    const englishWords = cleanText
      .replace(/[\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2); // 过滤短词

    for (const word of englishWords) {
      tokens.add(word);
    }

    return tokens;
  }

  /**
   * 计算交集大小
   */
  private getIntersectionSize(set1: Set<string>, set2: Set<string>): number {
    let count = 0;
    const smaller = set1.size <= set2.size ? set1 : set2;
    const larger = set1.size > set2.size ? set1 : set2;

    for (const item of smaller) {
      if (larger.has(item)) {
        count++;
      }
    }

    return count;
  }
}
