package restaurants

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)

func IndexRestaurantsController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	place := r.Context().Value("places").(models.Places)

	database := services.GetConnection()

	var restaurants []*models.Restaurant

	database.Where("place_id = ?", place.ID).Preload("Places").Find(&restaurants)

	responses.OkResponse(w, restaurants)
}
