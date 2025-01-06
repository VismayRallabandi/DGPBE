import { Controller, Post, Get, Param, Body, Res, Patch } from '@nestjs/common';
import { FormService } from './form.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateFormDto, UpdateFormDto} from './dto/create-form.dto';
import { FastifyReply } from 'fastify';

@ApiTags('Forms')
@Controller('forms')
export class FormController {
    constructor(private readonly formService: FormService) {}
    @Get('locations')
    async getAllLocations(@Res() res: FastifyReply) {
      try {
        const locations = await this.formService.getAllLocationDetails();
        const locationNames = locations.map(locations => locations.building_name);
        res.status(200).send(locationNames);
      } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).send({ error: 'Failed to fetch locations' });
      }
    }

    @Get('vendors')
    async getAllVendors(@Res() res: FastifyReply) {
      try {
        const vendors = await this.formService.getAllVendors();
        const vendorNames = vendors.map(vendor => vendor.name);
        res.status(200).send(vendorNames);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).send({ error: 'Failed to fetch vendors' });
      }
    }
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

    @Get('/gate-passes')
    async getAllGatePasses() {
      try {
        const gatePasses = await this.formService.getAllGatePasses();
        console.log('Gate passes:', gatePasses);
        return { data: gatePasses }; // NestJS automatically returns a response with status 200
      } catch (error) {
        console.error('Error fetching gate passes:', error);
        return { error: 'Failed to fetch gate passes' }; // NestJS returns status 500 automatically
      }
    }
    @Patch(':serialNumber')
    async approveForm(@Param('serialNumber') serialNumber: number, @Body() updateFormDto: UpdateFormDto) {
        console.log(updateFormDto);
        return await this.formService.approve(serialNumber, updateFormDto);
    }
}
