import { getModelForClass, index, Prop, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { customAlphabet } from "nanoid";
import { User } from "./user.schema";
import { IsNumber, MaxLength, Min, MinLength } from "class-validator";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10);

@ObjectType()
@index({ pieceId: 1 })
export class Piece {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true, ref: () => User })
  owner: Ref<User>;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  deepMyint: string;

  @Field(() => String)
  @prop({ required: true, default: () => `piece_${nanoid()}, unique: true}` })
  pieceId: string;
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
  deepMyint: string
}

@InputType()
export class GetPieceInput {
  @Field()
  pieceId: string
}
