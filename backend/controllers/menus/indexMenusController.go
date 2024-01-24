package menus

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)

func IndexMenusController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurants").(models.Restaurant)

	database := services.GetConnection()

	var menus []*models.Menus

	database.Where("restaurant_id = ?", restaurant.ID).Preload("Restaurant").Find(&menus)
	responses.OkResponse(w, menus)
}