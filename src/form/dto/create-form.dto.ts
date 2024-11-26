import { IsString,IsBoolean,IsInt,IsDateString } from "class-validator";

export class CreateFormDto{
    @IsString()
    formType: 'inward' | 'outward';
    
    @IsString()
    buildingName: string;

    @IsInt()
    serialNumber: number;

    @IsDateString()
    date: string;

    @IsString()
    time: string;

    @IsString()
    fromAddress: string;

    @IsBoolean()
    returnable: boolean;

    @IsString()
    securityPerson: string;

    @IsString()
    description: string;

    @IsInt()
    quantity: number;

    @IsString()
    remarks: string;

    @IsString()
    senderName: string;

    @IsString()
    receiverName: string;

    @IsDateString()
    dateofReturn: string;



}