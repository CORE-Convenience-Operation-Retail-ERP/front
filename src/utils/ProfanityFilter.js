/**
 * 욕설 필터링 유틸리티
 * 클라이언트 측에서 실시간으로 욕설을 감지하는 기능을 제공합니다.
 */

// 기본 욕설 목록 (백엔드와 동일한 목록 유지)
const profanityWords = [
  "개새끼", "병신", "씨발", "좆", "지랄", "염병", "썅", "꺼져", "새끼", "시발", 
  "미친", "엿먹어", "개자식", "쓰레기", "바보", "멍청이", "등신", "찐따"
];

// 초성 패턴 (자음만 사용한 욕설)
const obfuscatedPatterns = ["ㅅㅂ", "ㅂㅅ", "ㅄ", "ㅆㅂ", "ㅈㄹ", "ㅅㅂㄴ", "ㄷㅊ"];

/**
 * 텍스트 정규화 (공백 제거, 소문자 변환)
 * @param {string} text 정규화할 텍스트
 * @returns {string} 정규화된 텍스트
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text.replace(/\s+/g, '').toLowerCase();
};

/**
 * 텍스트에 욕설이 포함되어 있는지 확인
 * @param {string} text 검사할 텍스트
 * @returns {boolean} 욕설 포함 여부
 */
export const containsProfanity = (text) => {
  if (!text || text.trim() === '') {
    return false;
  }
  
  const normalizedText = normalizeText(text);
  
  // 기본 욕설 단어 검사
  for (const word of profanityWords) {
    if (normalizedText.includes(word)) {
      return true;
    }
  }
  
  // 초성 패턴 검사
  for (const pattern of obfuscatedPatterns) {
    if (normalizedText.includes(pattern)) {
      return true;
    }
  }
  
  return false;
};

/**
 * 텍스트에서 욕설을 찾아 마스킹 처리
 * @param {string} text 마스킹할 텍스트
 * @returns {string} 마스킹된 텍스트
 */
export const maskProfanity = (text) => {
  if (!text) return '';
  
  let maskedText = text;
  
  // 기본 욕설 마스킹
  for (const word of profanityWords) {
    if (maskedText.includes(word)) {
      const mask = '*'.repeat(word.length);
      maskedText = maskedText.replace(new RegExp(word, 'gi'), mask);
    }
  }
  
  // 초성 패턴 마스킹
  for (const pattern of obfuscatedPatterns) {
    if (maskedText.includes(pattern)) {
      const mask = '*'.repeat(pattern.length);
      maskedText = maskedText.replace(new RegExp(pattern, 'gi'), mask);
    }
  }
  
  return maskedText;
};

/**
 * 텍스트 내 비속어를 찾아 위치와 해당 단어를 반환
 * @param {string} text 검사할 텍스트
 * @returns {Array<{word: string, index: number, length: number}>} 발견된 욕설 목록
 */
export const findProfanities = (text) => {
  if (!text || text.trim() === '') {
    return [];
  }
  
  const foundProfanities = [];
  
  // 기본 욕설 검사
  for (const word of profanityWords) {
    let index = text.toLowerCase().indexOf(word.toLowerCase());
    while (index !== -1) {
      foundProfanities.push({
        word: text.substr(index, word.length),
        index,
        length: word.length,
        type: 'full'
      });
      index = text.toLowerCase().indexOf(word.toLowerCase(), index + 1);
    }
  }
  
  // 초성 패턴 검사
  for (const pattern of obfuscatedPatterns) {
    let index = text.indexOf(pattern);
    while (index !== -1) {
      foundProfanities.push({
        word: text.substr(index, pattern.length),
        index,
        length: pattern.length,
        type: 'initial'
      });
      index = text.indexOf(pattern, index + 1);
    }
  }
  
  // 인덱스 기준으로 정렬
  return foundProfanities.sort((a, b) => a.index - b.index);
};

/**
 * 텍스트에서 비속어를 찾아 하이라이트된 HTML 마크업 생성
 * @param {string} text 검사할 텍스트
 * @returns {{html: string, hasProfanity: boolean}} 하이라이트된 HTML 마크업과 비속어 포함 여부
 */
export const highlightProfanity = (text) => {
  if (!text || text.trim() === '') {
    return { html: '', hasProfanity: false };
  }
  
  const profanities = findProfanities(text);
  
  if (profanities.length === 0) {
    return { html: text, hasProfanity: false };
  }
  
  let result = '';
  let lastIndex = 0;
  
  for (const { index, length } of profanities) {
    // 욕설 이전 텍스트 추가
    if (index > lastIndex) {
      result += text.substring(lastIndex, index);
    }
    
    // 욕설 하이라이트 처리
    const profanityText = text.substring(index, index + length);
    result += `<span class="profanity-highlight">${profanityText}</span>`;
    
    lastIndex = index + length;
  }
  
  // 남은 텍스트 추가
  if (lastIndex < text.length) {
    result += text.substring(lastIndex);
  }
  
  return { html: result, hasProfanity: true };
};

export default {
  containsProfanity,
  maskProfanity,
  findProfanities,
  highlightProfanity
}; 