export interface ReturnFunction<TInput, TReturn> {
    (input: TInput): TReturn;
}