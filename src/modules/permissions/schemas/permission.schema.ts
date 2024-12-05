import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Permission {
  @Prop({ unique: true, uppercase: true, requred: true, trim: true })
  name: string;
}

export const permissionSchema = SchemaFactory.createForClass(Permission);
