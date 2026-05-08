import Vocabulary from './vocabulary.csv?raw'

export function parseVocabularyCSV(): Vocabulary[] {
  const lines = Vocabulary.trim().split('\n')
  return lines.map((line, index) => {
    const [word, chinese, english_def] = line.split(',')
    return {
      id: index + 1,
      word: word.trim(),
      chinese: chinese.trim(),
      english_def: english_def?.trim() || null
    }
  })
}