package responses

import (
	"net/http"

	"github.com/google/jsonapi"
)

func OkResponse(w http.ResponseWriter, data interface{}) {
	w.WriteHeader(http.StatusOK)

	jsonapi.MarshalPayloadWithoutIncluded(w, data)
}
