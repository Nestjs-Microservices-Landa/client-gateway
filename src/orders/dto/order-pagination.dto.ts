import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enums/order.enum";
import { PaginationDto } from "src/common";
import { Transform } from "class-transformer";

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @Transform(({ value }) => value?.toUpperCase())
    @IsEnum( OrderStatusList, {
        message: `Possible values are: ${OrderStatusList}`,
    })
    status: OrderStatus;
}