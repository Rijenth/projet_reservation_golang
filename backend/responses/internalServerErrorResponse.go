package responses

import (
	"net/http"

	"github.com/google/jsonapi"
)

func InternalServerErrorResponse(w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusInternalServerError)

	jsonapi.MarshalErrors(w, []*jsonapi.ErrorObject{{
		Title:  "Internal Server Error",
		Detail: message,
		Status: "500",
	}})
}
