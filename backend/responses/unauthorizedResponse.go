package responses

import (
	"net/http"

	"github.com/google/jsonapi"
)

func UnauthorizedResponse(w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusUnauthorized)

	jsonapi.MarshalErrors(w, []*jsonapi.ErrorObject{{
		Title:  "Unauthorized",
		Detail: message,
		Status: "401",
	}})
}
