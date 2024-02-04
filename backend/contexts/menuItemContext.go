package contexts

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/jsonapi"
	"gorm.io/gorm/clause"
)

func MenuItemContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		menuItemID := chi.URLParam(r, "menuItemId")

		var menuItem models.MenuItem

		database := services.GetConnection()

		database.Preload(clause.Associations).First(&menuItem, menuItemID)

		if menuItem.ID == 0 {
			w.Header().Set("Content-Type", jsonapi.MediaType)

			responses.NotFoundResponse(w, "Menu item not found")

			return
		}

		ctx := context.WithValue(r.Context(), "menu-item", menuItem)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
