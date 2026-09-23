import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * 🛠️ DTO DÖNÜŞDÜRÜCÜ KÖMƏKÇİ FUNKSİYALARI (Transformers)
 * 
 * 💡 NƏ İŞƏ YARIYIR?
 * Brauzerdən `FormData` (şəkil yükləyərkən) gələn məlumatlar string formatında olur.
 * Bu funksiyalar gələn string-i avtomatik ədədə, boolean-a və ya JSON massivinə çevirir.
 */
const parseJsonArray = ({ value }: { value: unknown }) => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return [value];
    }
  }
  return value;
};

const parseBoolean = ({ value }: { value: unknown }) => {
  if (typeof value === 'string') {
    return value === 'true';
  }
  return value;
};

const parseNumber = ({ value }: { value: unknown }) => {
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return isNaN(num) ? value : num;
  }
  return value;
};

/**
 * 📩 ADD POSTER DTO (Yeni Poster Əlavə Etmə DTO-su)
 * 
 * Yeni poster yaradılarkən gələn məlumatların doğruluğunu yoxlayır.
 */
export class AddPosterDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsString()
  @IsNotEmpty()
  dimensions!: string;

  @IsString()
  @IsOptional()
  material?: string;

  @IsBoolean()
  @IsNotEmpty()
  isAvailable!: boolean;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags!: string[];

  @IsNumber()
  @IsNotEmpty()
  stock!: number;

  @IsString()
  @IsNotEmpty()
  category!: string;
}

/**
 * 🔄 UPDATE POSTER DTO (Posteri Yeniləmə DTO-su)
 * 
 * Mövcud posterin sahələrini dəyişərkən istifadə olunur (Bütün sahələr optional-dır).
 */
export class UpdatePosterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(parseNumber)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Transform(parseNumber)
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(parseBoolean)
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsString()
  @IsOptional()
  material?: string;

  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @IsString({ each: true })
  imagesToDelete?: string[];

  @IsOptional()
  @IsEnum(['replace', 'add'])
  imageAction?: 'replace' | 'add';
}

/**
 * 🖼️ IMAGE UPDATE DTO
 */
export class ImageUpdateDto {
  @IsOptional()
  @IsString()
  public_id?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;
}

