package routes

import (
	"backend/contexts"
	"backend/controllers"

	"github.com/go-chi/chi/v5"
)

func MenuRoutes() chi.Router {
	r := chi.NewRouter()

	menuController := controllers.MenuController{}

	r.With(contexts.MenuContext).Get("/{menuId}", menuController.Get)
	r.With(contexts.MenuContext).Patch("/{menuId}", menuController.Update)
	r.With(contexts.MenuContext).Delete("/{menuId}", menuController.Delete)

	return r
}
