/**
 * Excel utilities using SheetJS (xlsx)
 * 
 * This module provides functions to read, edit, and export Excel files
 * in the browser for creator status management.
 */

import * as XLSX from 'xlsx'

export interface CreatorSheetRow {
  Name: string
  Instagram: string
  Followers: number
  'Avg Views': number
  Commercial: string
  Status: string
}

/**
 * Read an Excel file and return the data as JSON
 */
export const readExcelFile = (file: File): Promise<CreatorSheetRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<CreatorSheetRow>(worksheet)
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = (error) => reject(error)
    reader.readAsBinaryString(file)
  })
}

/**
 * Create and download an Excel file from JSON data
 */
export const downloadExcelFile = (data: CreatorSheetRow[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Creators')
  
  // Auto-size columns
  const maxWidth = data.reduce((w, r) => {
    return Object.keys(r).reduce((a, key) => {
      const cellValue = String(r[key as keyof CreatorSheetRow] || '')
      return Math.max(a, cellValue.length)
    }, w)
  }, 10)
  
  const cols = Object.keys(data[0] || {}).map(() => ({ wch: Math.min(maxWidth, 30) }))
  worksheet['!cols'] = cols
  
  // Generate Excel file and download
  XLSX.writeFile(workbook, filename)
}

/**
 * Download the original creator sheet from URL
 */
export const downloadFromUrl = async (url: string, filename: string) => {
  const response = await fetch(url)
  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  window.URL.revokeObjectURL(blobUrl)
}

/**
 * Update status for multiple creators in the sheet data
 */
export const updateCreatorStatuses = (
  data: CreatorSheetRow[],
  updates: Array<{ instagram: string; status: string }>
): CreatorSheetRow[] => {
  return data.map((row) => {
    const update = updates.find((u) => u.instagram === row.Instagram)
    if (update) {
      return { ...row, Status: update.status }
    }
    return row
  })
}

/**
 * Example: In-browser Excel editor integration
 * 
 * Usage:
 * ```tsx
 * import { readExcelFile, downloadExcelFile, updateCreatorStatuses } from '@/lib/excel'
 * 
 * const handleFileUpload = async (file: File) => {
 *   const data = await readExcelFile(file)
 *   console.log('Creators:', data)
 * }
 * 
 * const handleStatusUpdate = (data: CreatorSheetRow[]) => {
 *   const updated = updateCreatorStatuses(data, [
 *     { instagram: '@creator1', status: 'accepted' },
 *     { instagram: '@creator2', status: 'rejected' }
 *   ])
 *   downloadExcelFile(updated, 'updated_creators.xlsx')
 * }
 * ```
 */
