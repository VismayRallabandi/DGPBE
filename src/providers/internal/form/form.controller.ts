import { Controller, Post, Get, Param, Body, Res } from '@nestjs/common';
import { FormService } from './form.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateFormDto } from './dto/create-form.dto';
import { FastifyReply } from 'fastify';

import * as PDFDocument from 'pdfkit';
import * as path from 'path';

@ApiTags('Forms')
@Controller('forms')
export class FormController {
    constructor(private readonly formService: FormService) {}

    @Post()
    async createForm(@Body() createFormDto: CreateFormDto) {
        return await this.formService.create(createFormDto);
    }

    @Get(':serialNumber/pdf')
    async getFormPdf(@Param('serialNumber') serialNumber: number, @Res() res: FastifyReply) {
        try {
            const pdfBuffer = await this.formService.generatePdf(serialNumber);
            res.header('Content-Type', 'application/pdf');
            res.header('Content-Disposition', `inline; filename="form-${serialNumber}.pdf"`);

            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send({ error: 'Failed to generate PDF' });
        }
    }

    @Get('gate-passes')
    async getAllGatePasses(@Res() res: FastifyReply) {
      try {
        const gatePasses = await this.formService.getAllGatePasses();
        console.log('Gate passes:', gatePasses);
        res.status(200).send(gatePasses);
      } catch (error) {
        console.error('Error fetching gate passes:', error);
        res.status(500).send({ error: 'Failed to fetch gate passes' });
      }
    }
}
