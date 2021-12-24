import { getModelForClass, index, Prop, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { customAlphabet } from "nanoid";
import { User } from "./user.schema";
import { IsNumber, MaxLength, Min, MinLength } from "class-validator";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10);

@ObjectType()
@index({ productId: 1 })
export class Piece {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  description: string;

  @Field(() => String)
  @prop({ required: true })
  price: string;

  @Field(() => String)
  @prop({ required: true, default: () => `product_${nanoid()}, unique: true}` })
  productId: string;
}

export const PieceModel = getModelForClass<typeof Piece>(Piece);

@InputType()
export class CreatePieceInput {
  @Field()
  name: string;

  @MinLength(50, {
    message: "Description must be at least 50 characters",
  })
  @MaxLength(1000, {
    message: "Description must not be more than 1000 characters",
  })
  @Field()
  description: string;

  @IsNumber()
  @Min(1)
  @Field()
  price: number;
}

@InputType()
export class GetPieceInput {
  @Field()
  productId: string;
}
