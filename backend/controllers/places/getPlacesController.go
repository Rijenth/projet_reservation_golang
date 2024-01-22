package places

import (
	"backend/models"
	"backend/responses"
	"net/http"

	"github.com/google/jsonapi"
)

func GetPlacesController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	places := r.Context().Value("places").(models.Places)

	responses.OkResponse(w, &places)
}