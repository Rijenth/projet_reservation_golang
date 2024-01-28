package responses

import (
	"net/http"

	"github.com/google/jsonapi"
)

func UnprocessableEntityResponse(w http.ResponseWriter, errs []error) {
	w.WriteHeader(http.StatusUnprocessableEntity)

	var errorObjects []*jsonapi.ErrorObject

	for _, err := range errs {
		var errorObject *jsonapi.ErrorObject

		errorObject = &jsonapi.ErrorObject{
			Title:  "Unprocessable entity",
			Detail: "",
			Status: "422",
		}

		errorObject.Detail = err.Error()

		errorObjects = append(errorObjects, errorObject)
	}

	jsonapi.MarshalErrors(w, errorObjects)
}
