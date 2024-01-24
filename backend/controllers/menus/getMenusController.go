package menus

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)


func GetMenusController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menus := r.Context().Value("menus").(models.Menus)

	database := services.GetConnection()

	database.Model(&menus).Association("Restaurant").Find(&menus.Restaurant)

	responses.OkResponse(w, menus)
}