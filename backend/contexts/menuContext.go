package contexts

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/jsonapi"
)

func MenuContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		menuID := chi.URLParam(r, "menuId")

		var menu models.Menu

		database := services.GetConnection()

		database.Preload("Restaurant").Preload("Menus").First(&menu, menuID)

		if menu.ID == 0 {
			w.Header().Set("Content-Type", jsonapi.MediaType)

			responses.NotFoundResponse(w, "Menu not found")

			return
		}

		ctx := context.WithValue(r.Context(), "menu", menu)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
