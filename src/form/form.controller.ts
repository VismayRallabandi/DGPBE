import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { Response } from 'express';

@Controller('forms')
export class FormController {
    constructor(private readonly formService: FormService) {}

    @Post()
    async createForm(@Body() createFormDto: CreateFormDto) {
        return await this.formService.create(createFormDto);
    }

    @Get(':id/pdf')
    async getFormPdf(@Param('serialNumber') serialNumber: number, @Res() res: Response) {
        const pdfBuffer = await this.formService.generatePdf(serialNumber);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="form-${serialNumber}.pdf"`,
        });
        res.send(pdfBuffer);
    }
}
