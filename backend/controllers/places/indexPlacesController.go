package places

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)

func IndexPlacesController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	user := r.Context().Value("user").(models.User)

	database := services.GetConnection()

	var places []*models.Places

	database.Where("user_id = ?", user.ID).Preload("User").Preload("Restaurants").Find(&places)

	responses.OkResponse(w, places)
}
