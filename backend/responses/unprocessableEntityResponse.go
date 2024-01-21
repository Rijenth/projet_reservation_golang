package responses

import (
	"net/http"

	"github.com/google/jsonapi"
)

func UnprocessableEntityResponse(w http.ResponseWriter, err string) {
	w.WriteHeader(http.StatusUnprocessableEntity)

	jsonapi.MarshalErrors(w, []*jsonapi.ErrorObject{{
		Title:  "Unprocessable Entity",
		Detail: err,
		Status: "422",
	}})
}
