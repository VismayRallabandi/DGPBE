import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entity/form.entity';
import { Item } from './entity/item.entity';
import { Vendors } from './entity/vendors.entity';
import { Locations } from './entity/locations.entity';
import { CreateFormDto,UpdateFormDto } from './dto/create-form.dto';
import { User } from '../../users/auth/entity/user.entity';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class FormService {
    constructor(
        @InjectRepository(Form)
        private formRepository: Repository<Form>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Vendors)
        private vendorRepository: Repository<Vendors>,
        @InjectRepository(Locations)
        private locationRepository: Repository<Locations>,
        @InjectRepository(User)
        private userRepository: Repository<User>

    ) {}
    async getAllVendors(): Promise<Vendors[]> {
        try {
            return await this.vendorRepository.find();
        } catch (error) {
            console.error('Error fetching vendors:', error);
            throw new Error('Failed to fetch vendors');
        }
    }
    async approve(formId: number, updateFormDto: UpdateFormDto): Promise<Form> {
      const form = await this.formRepository.findOne({ where: { serialNumber: formId } });

      if (!form) {
        throw new Error('Form not found');
      }

      if (!form.approved) {
        form.approved = true;
      } else if (!form.completed) {

        form.completed = true;
        form.date = new Date().toISOString().split('T')[0].toString(); // Current date in YYYY-MM-DD format
        form.time = new Date().toLocaleTimeString().toString();
        form.securityPerson = updateFormDto.securityPerson;
        form.remarks = updateFormDto.remarks 
      }

      await this.formRepository.save(form);

      return form;

    }
    async getAllLocationDetails(): Promise<Locations[]> {
        try {
            return await this.locationRepository.find();
        } catch (error) {
            console.error('Error fetching location details:', error);
            throw new Error('Failed to fetch location details');
        }
    }
    async create(createFormDto: CreateFormDto): Promise<Form> {
        try {
            console.log('Received DTO:', JSON.stringify(createFormDto, null, 2));
            const user = await this.userRepository.findOne({ where: { email: createFormDto.requesterName }, relations: ['location'] });
            if (!user) {
              throw new Error('User not found');
            }
            
            const location = await this.locationRepository.findOne({ where: { building_name: user.location.building_name } });
            const community_manager = location ? location.community_manager : null;
            // Ensure building_name is a string
            
            // Create the form first
            const form = this.formRepository.create({
              invoiceNumber: createFormDto.invoiceNumber,
              formType: createFormDto.formType,
              otherAddress: createFormDto.otherAddress,
              returnable: createFormDto.returnable,
              requesterName: createFormDto.requesterName,
              dateofReturn: createFormDto.dateofReturn,
              communityManager: community_manager,
              buildingName: createFormDto.buildingName
            });

            console.log('Form entity created:', form);

            // Save the form to get its ID
            const savedForm = await this.formRepository.save(form);
            console.log('Form saved with ID:', savedForm.serialNumber);

            // Only process items if they exist
            if (createFormDto.items && Array.isArray(createFormDto.items)) {
                const itemsToCreate = createFormDto.items.map(itemData => {
                    return this.itemRepository.create({
                        description: itemData.description || '',
                        quantity: itemData.quantity || 0,
                        itemCode: itemData.itemCode || '',
                        modelName: itemData.modelName || '',
                        formId: savedForm.serialNumber
                    });
                });

                if (itemsToCreate.length > 0) {
                    const savedItems = await this.itemRepository.save(itemsToCreate);
                    console.log('Items saved successfully:', savedItems);
                }
            }

            return this.formRepository.findOne({
                where: { serialNumber: savedForm.serialNumber },
                relations: ['items']
            });

        } catch (error) {
            console.error('Error in create method:', {
                message: error.message,
                stack: error.stack,
                dto: createFormDto
            });
            throw error;
        }
    }

    async getAllGatePasses() {
      try {
        return await this.formRepository.find({
          select: ['serialNumber', 'buildingName','approved','completed'], // This ensures serialNumber, buildingName, approved, and completed are returned
        });

      } catch (error) {
        console.error('Error fetching gate passes:', error);
        throw new Error('Failed to fetch gate passes');
      }
    }
        async generatePdf(formId: number): Promise<Buffer> {
          const form = await this.formRepository.findOne({ 
              where: { serialNumber: formId },
              relations: ['items']
          });
          console.log('Form:', form);
          console.log('Items:', form.items);
          if (!form) throw new Error('Form not found');
          if (!form.items) throw new Error('Items not loaded');
      
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
              doc.image('./Logo.png', 50, 30, { width: 100 }); // Adjust the logo placement
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
            yPos = addFullRow(
              form.formType.toLowerCase() === 'inward' ? 'Receiver Name' : 'Sender Name',
              form.requesterName,
              yPos
            );
            yPos = addFullRow('Status', form.returnable ? 'Returnable' : 'Non-Returnable', yPos);
      
            if (form.returnable) {
              yPos = addFullRow('Return Date', form.dateofReturn, yPos);
            }
      
            // Items section
            if (form.items && form.items.length > 0) {
              yPos += 10;
              const itemsStartY = yPos;
              const itemsHeight = 30 + (form.items.length * 25);
              
              // Draw items box
              doc.rect(startX, itemsStartY, endX - startX, itemsHeight).stroke();
              
              // Add items header
              doc.font('Helvetica-Bold').text('Items:', startX + boxPadding, itemsStartY + boxPadding);
              yPos += 25;
              
              // Render each item with more details
              form.items.forEach((item, index) => {
                doc.font('Helvetica')
                   .text(
                       `${index + 1}. ${item.description} - Code: ${item.itemCode} - Model: ${item.modelName} (Qty: ${item.quantity})`,
                       startX + 20,  // Increased indent
                       yPos,
                       { width: endX - startX - 40 }  // Set maximum width to prevent overflow
                   );
                yPos += 25;  // Increased spacing between items
              });
              yPos += 10;
            }
      
            // Remaining fields
            yPos = addFullRow('Remarks', form.remarks, yPos);
            yPos = addRowPair('Approval Status', form.approved ? 'Approved' : 'Pending', 'Signator', form.communityManager, yPos);
      
            // === Footer Section ===
      
            // Finalize the PDF
            doc.end();
          });
        }
  
 


        
        

    
      

    async getFormWithItems(formId: number): Promise<Form> {
        const form = await this.formRepository.findOne({
            where: { serialNumber: formId },
            relations: ['items']
        });
        
        console.log('Retrieved form with items:', form);
        return form;
    }
}   
