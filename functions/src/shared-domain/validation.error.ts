﻿/**
 * Interfaces que encapsulan errores.
 * @interface
 */

export interface ValidationError {
    message: string;
}

export interface AlreadyExistsError {
    is: boolean;
}

export interface NotExistsError {
    no: boolean;
}