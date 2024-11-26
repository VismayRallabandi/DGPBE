import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entity/form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

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

    async generatePdf(formId: number): Promise<Buffer> {
        const form = await this.formRepository.findOne({ where: { serialNumber: formId } });
        if (!form) throw new Error('Form not found');

        const pdfTemplate = form.formType === 'inward' 
            ? 'inward-template.pdf' 
            : 'outward-template.pdf';
    
        const pdfPath = path.join(__dirname, '../../templates', pdfTemplate);
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
    
        const formFields = pdfDoc.getForm();
    
        // Fill in the new fields
        formFields.getTextField('buildingName').setText(form.buildingName);
        
        formFields.getTextField('date').setText(form.date);
        formFields.getTextField('time').setText(form.time);
        formFields.getTextField('description').setText(form.description);
        formFields.getTextField('quantity').setText(form.quantity.toString());
        formFields.getTextField('fromAddress').setText(form.fromAddress);
        formFields.getTextField('returnable').setText(form.returnable ? 'Yes' : 'No');
        formFields.getTextField('securityPerson').setText(form.securityPerson);
        formFields.getTextField('remarks').setText(form.remarks);
        formFields.getTextField('receiverName').setText(form.receiverName);
        formFields.getTextField('senderName').setText(form.senderName);
        formFields.getTextField('dateofReturn').setText(form.dateofReturn);
        const pdfBYtesOutput = await pdfDoc.save();
        return Buffer.from(pdfBYtesOutput);
    }
    
}
