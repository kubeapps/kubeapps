package handlerutil

import (
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"

	"github.com/gorilla/mux"
	appRepov1 "github.com/kubeapps/kubeapps/cmd/apprepository-controller/pkg/apis/apprepository/v1alpha1"
	chartUtils "github.com/kubeapps/kubeapps/pkg/chart"
	"github.com/kubeapps/kubeapps/pkg/kube"
	"helm.sh/helm/v3/pkg/chart"
)

// Params a key-value map of path params
type Params map[string]string

// WithParams can be used to wrap handlers to take an extra arg for path params
type WithParams func(http.ResponseWriter, *http.Request, Params)

func (h WithParams) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	h(w, req, vars)
}

// WithoutParams can be used to wrap handlers that doesn't take params
type WithoutParams func(http.ResponseWriter, *http.Request)

func (h WithoutParams) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	h(w, req)
}

func isNotFound(err error) bool {
	// TODO(mnelson): When helm updates to use golang wrapped errors, switch these
	// to use errors.is(err, ...) etc.
	return strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no revision for release")
}

func isAlreadyExists(err error) bool {
	return strings.Contains(err.Error(), "is still in use") || strings.Contains(err.Error(), "already exists")
}

func isForbidden(err error) bool {
	return strings.Contains(err.Error(), "Unauthorized") || strings.Contains(err.Error(), "forbidden")
}

func isUnprocessable(err error) bool {
	re := regexp.MustCompile(`[rR]elease.*failed`)
	return re.MatchString(err.Error())
}

// ErrorCode returns the int representing an error.
func ErrorCode(err error) int {
	return ErrorCodeWithDefault(err, http.StatusInternalServerError)
}

// ErrorCodeWithDefault returns the int representing an error with a default value.
func ErrorCodeWithDefault(err error, defaultCode int) int {
	if isAlreadyExists(err) {
		return http.StatusConflict
	} else if isForbidden(err) {
		return http.StatusForbidden
	} else if isNotFound(err) {
		return http.StatusNotFound
	} else if isUnprocessable(err) {
		return http.StatusUnprocessableEntity
	}
	return defaultCode
}

// ParseRequest extract chart info from the request
func ParseRequest(req *http.Request) (*chartUtils.Details, error) {
	defer req.Body.Close()
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		return nil, err
	}
	chartDetails, err := chartUtils.ParseDetails(body)
	if err != nil {
		return nil, err
	}
	return chartDetails, nil
}

// ResolverFactory interface to return a resolver
type ResolverFactory interface {
	New(repoType, userAgent string) chartUtils.Resolver
}

// ClientResolver implements ResolverFactory
type ClientResolver struct{}

// New for ClientResolver
func (c *ClientResolver) New(repoType, userAgent string) chartUtils.Resolver {
	var cu chartUtils.Resolver
	switch repoType {
	case "oci":
		// TBD
		// cu = chartUtils.NewOCIClient(userAgent)
		break
	default:
		cu = chartUtils.NewChartClient(userAgent)
	}
	return cu
}

// GetChart retrieves a chart
func GetChart(chartDetails *chartUtils.Details, appRepo *appRepov1.AppRepository, kubeCli kube.AuthedHandler, resolver chartUtils.Resolver, handler kube.AuthHandler) (*chart.Chart, error) {
	err := resolver.InitClient(appRepo, kubeCli)
	if err != nil {
		return nil, err
	}
	ch, err := resolver.GetChart(chartDetails, appRepo.Spec.URL)
	if err != nil {
		return nil, err
	}
	return ch, nil
}

// QueryParamIsTruthy returns true if the req param is "1" or "true"
func QueryParamIsTruthy(param string, req *http.Request) bool {
	value := req.URL.Query().Get(param)
	return value == "1" || value == "true"
}
