# This file contains custom exceptions for the models so that when
# an error occurs, it can be caught and handled appropriately.

class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass 

class DrawValidationError(Exception):
    pass

class ReceiptValidationError(Exception):
    pass

class DrawSequenceError(DrawValidationError):
    pass

class DrawAmountError(DrawValidationError):
    pass

class DrawApprovalError(DrawValidationError):
    pass

class ReceiptAmountError(ReceiptValidationError):
    pass

class ReceiptDateError(ReceiptValidationError):
    pass

class ReceiptDuplicateError(ReceiptValidationError):
    pass 