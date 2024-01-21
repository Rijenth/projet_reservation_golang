package responses

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
)

func FailedValidationResponse(w http.ResponseWriter, err error) {
	var message string

	for index, e := range err.(validator.ValidationErrors) {
		message += fmt.Sprintf("Field %s is invalid", e.Field())

		if index < len(err.(validator.ValidationErrors))-1 {
			message += ", "
		} else {
			message += "."
		}
	}

	UnprocessableEntityResponse(w, message)
}
