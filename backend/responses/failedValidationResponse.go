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
			for _, e := range validationErr {
				errorMessage := e.Error()

				errorMessageIndex := strings.Index(errorMessage, "Error:")

				message := fmt.Errorf(strings.ToLower(errorMessage[errorMessageIndex+len("Error:"):]))

				fieldError := fmt.Errorf("%s", message)

				errors = append(errors, fieldError)
			}
		} else {
			errors = append(errors, err)
		}
	}

	UnprocessableEntityResponse(w, errors)
}
