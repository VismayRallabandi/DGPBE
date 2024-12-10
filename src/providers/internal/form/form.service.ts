import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entity/form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { PassThrough } from 'stream';
import path from 'path';
@Injectable()
export class FormService {
    constructor(
        @InjectRepository(Form)
        private formRepository: Repository<Form>,
    ) {}

    async create(createFormDto: CreateFormDto): Promise<Form> {
        const form = this.formRepository.create(createFormDto);
        return await this.formRepository.save(form);
    }
    async getAllGatePasses() {
            try {
            return await this.formRepository.find({
                select: ['serialNumber', 'buildingName'], // This ensures only the serialNumber and buildingName are returned
            });
            } catch (error) {
            console.error('Error fetching gate passes:', error);
            throw new Error('Failed to fetch gate passes');
            }
        }
        async generatePdf(formId: number): Promise<Buffer> {
          const form = await this.formRepository.findOne({ where: { serialNumber: formId } });
          if (!form) throw new Error('Form not found');
      
          return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
              size: 'A4',
              layout: 'landscape',
              margins: { top: 50, bottom: 50, left: 50, right: 50 },
            });
        
            const buffers = [];
            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', (err) => reject(err));
      
            // Add border around the entire page
            const pageWidth = 842;  // A4 landscape width in points
            const pageHeight = 595; // A4 landscape height in points
            doc.rect(20, 20, pageWidth - 40, pageHeight - 40).stroke(); // Thin border with 20pt margin
      
            // === Company Logo ===
            try {
              doc.image('Logo.png', 50, 30, { width: 100 }); // Adjust the logo placement
            } catch (e) {
              console.warn('Logo not found. Skipping logo placement.');
            }
            doc.fontSize(20).font('Helvetica-Bold').text('Material Gate Pass', 0, 30, { align: 'center' });
      
            // === Gate Pass Header ===
            doc.fontSize(12).font('Helvetica-Bold').text(`Gate Pass No.:`, 550, 30, { continued: true });
            doc.font('Helvetica').text(` ${form.serialNumber}`);
      
            // Draw a line under the header
            doc.moveTo(50, 80).lineTo(750, 80);
      
            // === Form Content Area ===
            // Remove the content area border
            // doc.rect(50, 90, 700, 380).stroke(); // Removing this line
      
            // === Form Details Section ===
            let yPos = 100;
            const lineHeight = 40;
            const boxPadding = 5;
            const columnWidth = 350;
            const startX = 50;
            const endX = startX + (columnWidth * 2);
            const midX = startX + columnWidth;
      
            // Helper function to add a field with label
            const addField = (label, value, x, y, width) => {
              doc.font('Helvetica-Bold').text(label + ':', x + boxPadding, y + boxPadding, { continued: true });
              doc.font('Helvetica').text(` ${value || 'N/A'}`);
              return y + lineHeight;
            };
      
            // Function to draw horizontal line
            const drawHorizontalLine = (y) => {
              doc.moveTo(startX, y).lineTo(endX, y).stroke();
            };
      
            // Function to draw vertical lines for current row
            const drawVerticalLines = (y, nextY, isSplit = true) => {
              doc.moveTo(startX, y).lineTo(startX, nextY).stroke();
              if (isSplit) {
                doc.moveTo(midX, y).lineTo(midX, nextY).stroke();
              }
              doc.moveTo(endX, y).lineTo(endX, nextY).stroke();
            };
      
            // Draw initial horizontal line
            drawHorizontalLine(yPos);
      
            // Add fields side by side
            const addRowPair = (label1, value1, label2, value2, y) => {
              addField(label1, value1, startX, y, columnWidth);
              addField(label2, value2, midX, y, columnWidth);
              drawVerticalLines(y, y + lineHeight);
              drawHorizontalLine(y + lineHeight);
              return y + lineHeight;
            };
      
            const addFullRow = (label, value, y) => {
              addField(label, value, startX, y, columnWidth * 2);
              drawVerticalLines(y, y + lineHeight, false);
              drawHorizontalLine(y + lineHeight);
              return y + lineHeight;
            };
      
            // Add paired fields
            yPos = addRowPair('Form Type', form.formType.toUpperCase(), 'Building Name', form.buildingName, yPos);
            yPos = addRowPair('Gate Pass No', form.serialNumber, 'Date', form.date, yPos);
            yPos = addRowPair('Time', form.time, 'Security Person', form.securityPerson, yPos);
      
            // Add full width fields
            yPos = addFullRow('Address', form.otherAddress, yPos);
            yPos = addFullRow('Requester Name', form.requesterName, yPos);
            yPos = addFullRow('Status', form.returnable ? 'Returnable' : 'Non-Returnable', yPos);
      
            if (form.returnable) {
              yPos = addFullRow('Return Date', form.dateofReturn, yPos);
            }
      
            // Items section
            if (form.items && form.items.length > 0) {
              yPos += 10;
              const itemsStartY = yPos;
              const itemsHeight = 20 + (form.items.length * 20);
              
              // Draw items box
              doc.moveTo(startX, itemsStartY).lineTo(endX, itemsStartY).stroke();
              doc.moveTo(startX, itemsStartY).lineTo(startX, itemsStartY + itemsHeight).stroke();
              doc.moveTo(endX, itemsStartY).lineTo(endX, itemsStartY + itemsHeight).stroke();
              doc.moveTo(startX, itemsStartY + itemsHeight).lineTo(endX, itemsStartY + itemsHeight).stroke();
              
              doc.font('Helvetica-Bold').text('Items:', startX + boxPadding, itemsStartY + boxPadding);
              yPos += 25;
              
              form.items.forEach((item, index) => {
                doc.font('Helvetica')
                   .text(`${index + 1}. ${item.description} (Qty: ${item.quantity})`, 70, yPos);
                yPos += 20;
              });
              yPos += 10;
            }
      
            // Remaining fields
            yPos = addFullRow('Remarks', form.remarks, yPos);
            yPos = addRowPair('Approval Status', form.approved ? 'Approved' : 'Pending', 'Signator', form.signator, yPos);
      
            // === Footer Section ===
            doc.moveTo(50, 500).lineTo(750, 500); // Add a footer line
            doc.fontSize(10).text('Authorized Signature:', 50, 520);
      
            // Finalize the PDF
            doc.end();
          });
        }
  
 


        
        

    
      
}   
