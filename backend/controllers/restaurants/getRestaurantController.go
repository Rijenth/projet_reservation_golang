package restaurants

import (
	"backend/models"
	"backend/responses"
	"net/http"

	"github.com/google/jsonapi"
)

func GetRestaurantController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	responses.OkResponse(w, &restaurant)
}
