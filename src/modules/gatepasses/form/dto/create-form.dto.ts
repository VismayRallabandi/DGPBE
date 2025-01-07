import { Type } from 'class-transformer';
import { IsString,IsBoolean,IsDateString,IsArray,ValidateNested,IsNotEmpty,IsOptional,IsNumber } from "class-validator";

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    itemCode: string;

    @IsString()
    @IsNotEmpty()
    modelName: string;
}

export class CreateFormDto{
    @IsString()
    formType: 'inward' | 'outward';
    
    @IsString()
    buildingName: string;


    @IsString()
    otherAddress: string;

    @IsBoolean()
    returnable: boolean;
    
    @IsString()
    requesterName: string;

    @IsString()
    @IsOptional()
    invoiceNumber?: string;
    
    @IsDateString()
    @IsOptional()
    dateofReturn?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateItemDto)
    @IsNotEmpty()
    items: CreateItemDto[];

    idate?: string;
    itime?: string;
    approved?: boolean;
    communityManager?: string;
    securityPerson?: string;
    remarks?: string;

}

export class UpdateFormDto{
    @IsBoolean()
    @IsOptional()
    approved?: boolean;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;

    @IsString()
    @IsOptional()
    date?: string;

    @IsString() 
    @IsOptional()
    time?: string;

    @IsString()
    @IsOptional()
    remarks?: string;

    @IsString()
    @IsOptional()
    securityPerson?: string;  
}