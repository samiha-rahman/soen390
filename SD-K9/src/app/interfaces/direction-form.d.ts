import { SourceDestination } from './source-destination';
import { Transport } from '../models/transport.enum.model';

export declare interface DirectionForm {
    sourceDestination: SourceDestination,
    transport: Transport;
}