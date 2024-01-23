package restaurants

import (
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)

func DeleteRestaurantController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	database.Delete(&restaurant)

	w.WriteHeader(http.StatusNoContent)
}
