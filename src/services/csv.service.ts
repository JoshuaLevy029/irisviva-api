import { Injectable } from "@nestjs/common"
import * as fs from "fs"
import * as path from "path"
import * as ExcelJS from "exceljs"
import { stringify } from "csv"

@Injectable()
export class CsvService {
    constructor () {}

    async createCSV<T>(data: T[], filename: string) {
        return new Promise((resolve, reject) => {
            stringify(data, { header: true }, async (error, output) => {
                if (error) {
                    reject(error)
                } else {
                    try {
                        resolve(output)
                    } catch (err) {
                        reject(err)
                    }
                }
            })
        })
    }

    async readPageXLSX<T = any>(filePath: string, worksheetIndexOrNumber: number|string = 1) {
        const workbook = new ExcelJS.Workbook()
        const result: T[] = []

        try {
            await workbook.xlsx.readFile(filePath)
            const worksheet = workbook.getWorksheet(worksheetIndexOrNumber)
            const headers = worksheet.getRow(1).values as string[]
            
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return

                const rowData: T = {} as T
                row.eachCell((cell, colNumber) => {
                    const header = headers[colNumber]

                    if (header) {
                        rowData[header] = cell.value
                    }
                })

                result.push(rowData)
            })

            return result
        } catch (error) {
            throw new Error(`Failed to read file: ${error.message}`)
        }
    }

    async readXLSX<T = any>(filePath: string) {
        const workbook = new ExcelJS.Workbook()
        const result: { sheetName: string; data: T[] }[] = []

        try {
            await workbook.xlsx.readFile(filePath)
            
            workbook.worksheets.forEach(worksheet => {
                const headers = worksheet.getRow(1).values as string[]
                const sheetData: T[] = []
            
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return
    
                    const rowData: T = {} as T
                    row.eachCell((cell, colNumber) => {
                        const header = headers[colNumber]
    
                        if (header) {
                            rowData[header] = cell.value
                        }
                    })
    
                    sheetData.push(rowData)
                })

                result.push({
                    sheetName: worksheet.name,
                    data: sheetData
                })
            })

            return result
        } catch (error) {
            throw new Error(`Failed to read file: ${error.message}`)
        }
    }

    async readCSV<T = any>(filePath: string, worksheetIndexOrNumber: number|string = 1) {
        const workbook = new ExcelJS.Workbook()
        const sheetData: T[] = []

        try {
            await workbook.csv.readFile(filePath)
            const worksheet = workbook.getWorksheet(worksheetIndexOrNumber)
            const headers = worksheet.getRow(1).values as string[]
            
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return

                const rowData: T = {} as T
                row.eachCell((cell, colNumber) => {
                    const header = headers[colNumber]

                    if (header) {
                        rowData[header] = cell.value
                    }
                })
                
                sheetData.push(rowData)
            })

            return sheetData
        } catch (error) {
            throw new Error(`Failed to read file: ${error.message}`)
        }
    }

    async readSpecificSheets<T = any>(filePath: string, sheetNames: string[]): Promise<{ sheetName: string; data: T[] }[]> {
        const workbook = new ExcelJS.Workbook();
        const results: { sheetName: string; data: T[] }[] = [];

        try {
            await workbook.xlsx.readFile(filePath);

            for (const sheetName of sheetNames) {
                const worksheet = workbook.getWorksheet(sheetName);
                
                if (!worksheet) {
                    console.warn(`Sheet "${sheetName}" not found`);
                    continue;
                }

                const sheetData: T[] = [];
                const headers = worksheet.getRow(1).values as string[];

                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;

                    const rowData: T = {} as T;
                    row.eachCell((cell, colNumber) => {
                        const header = headers[colNumber];
                        if (header) {
                            rowData[header] = cell.value;
                        }
                    });

                    sheetData.push(rowData);
                });

                results.push({
                    sheetName: worksheet.name,
                    data: sheetData
                });
            }

            return results;
        } catch (error) {
            throw new Error(`Failed to read specific sheets: ${error.message}`);
        }
    }
}