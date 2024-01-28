package responses

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
)

func FailedValidationResponse(w http.ResponseWriter, errs []error) {
	var errors []error

	for _, err := range errs {
		if validationErr, ok := err.(validator.ValidationErrors); ok {
			for index, e := range validationErr {
				message := fmt.Errorf("Field %s is invalid at index %x", e.Field(), index)

				errorMessage := e.Error()

				errorMessageIndex := strings.Index(errorMessage, "Error:")

				if errorMessageIndex != -1 {
					message = fmt.Errorf("%s because %s", message, strings.ToLower(errorMessage[errorMessageIndex+len("Error:"):]))
				}

				fieldError := fmt.Errorf("%s", message)

				errors = append(errors, fieldError)
			}
		} else {
			errors = append(errors, err)
		}
	}

	UnprocessableEntityResponse(w, errors)
}
