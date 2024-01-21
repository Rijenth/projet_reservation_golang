package responses

import (
	"net/http"

	"github.com/google/jsonapi"
)

func CreatedResponse(w http.ResponseWriter, data interface{}) {
	w.WriteHeader(http.StatusCreated)

	jsonapi.MarshalPayload(w, data)
}
