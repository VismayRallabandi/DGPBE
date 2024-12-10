import { IsString,IsBoolean,IsDateString,IsArray,ValidateNested,IsNotEmpty,IsOptional } from "class-validator";

export class CreateFormDto{
    @IsString()
    formType: 'inward' | 'outward';
    
    @IsString()
    buildingName: string;


    @IsDateString()
    date: string;

    @IsString()
    time: string;

    @IsString()
    otherAddress: string;

    @IsBoolean()
    returnable: boolean;

    @IsString()
    securityPerson: string;

    
    @IsString()
    remarks: string;

    @IsString()
    requesterName: string;

    @IsDateString()
    @IsOptional()
    dateofReturn?: string;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    items: {
      description: string;
      quantity: number;
      itemCode: string;
      modelName: string;
    }[];

    idate?: string;
    itime?: string;
    approved?: boolean;
    signator?: string;


}