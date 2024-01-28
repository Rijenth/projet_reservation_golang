package validators

import (
	"backend/responses"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/go-playground/validator/v10"
)

type ValidationHelpers struct {
}

func ValidateBody(structToValidate interface{}, body *io.ReadCloser, w *http.ResponseWriter) error {
	err := json.NewDecoder(*body).Decode(&structToValidate)

	if err != nil {
		if err.Error() == "EOF" {
			responses.UnprocessableEntityResponse(*w, []error{fmt.Errorf("The body is empty")})

			return err
		}

		responses.UnprocessableEntityResponse(*w, []error{err})

		return err
	}

	return nil
}

func ValidateStruct(structToValidate interface{}, body *io.ReadCloser, w *http.ResponseWriter) error {
	validate := validator.New()

	if err := validate.Struct(structToValidate); err != nil {
		return err
	}

	return nil
}
