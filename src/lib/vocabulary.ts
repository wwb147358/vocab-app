import csvContent from './vocabulary.csv?raw'
import type { Vocabulary } from '../types'

export function parseVocabularyCSV(): Vocabulary[] {
  const lines = csvContent.trim().split('\n')
  return lines.map((line: string, index: number) => {
    const [word, chinese, english_def] = line.split(',')
    return {
      id: index + 1,
      word: word.trim(),
      chinese: chinese.trim(),
      english_def: english_def?.trim() || null
    }
  })
}
