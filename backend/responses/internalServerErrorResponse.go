package responses

import (
	"net/http"

	"github.com/google/jsonapi"
)

func InternalServerErrorResponse(w http.ResponseWriter, err string) {
	w.WriteHeader(http.StatusInternalServerError)

	jsonapi.MarshalErrors(w, []*jsonapi.ErrorObject{{
		Title:  "Internal Server Error",
		Detail: err,
		Status: "500",
	}})
}
