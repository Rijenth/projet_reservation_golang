package responses

import (
	"net/http"

	"github.com/google/jsonapi"
)

func NotFoundResponse(w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusNotFound)

	jsonapi.MarshalErrors(w, []*jsonapi.ErrorObject{{
		Title:  "Not found",
		Detail: message,
		Status: "404",
	}})
}
