// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0
// 	protoc        v3.17.1
// source: kubeappsapis/plugins/helm/packages/v1alpha1/helm.proto

package v1alpha1

import (
	_ "github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2/options"
	v1alpha1 "github.com/kubeapps/kubeapps/cmd/kubeapps-apis/gen/core/packages/v1alpha1"
	_ "github.com/kubeapps/kubeapps/cmd/kubeapps-apis/gen/core/plugins/v1alpha1"
	_ "google.golang.org/genproto/googleapis/api/annotations"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

var File_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto protoreflect.FileDescriptor

var file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_rawDesc = []byte{
	0x0a, 0x36, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2f, 0x70,
	0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73, 0x2f, 0x68, 0x65, 0x6c, 0x6d, 0x2f, 0x70, 0x61, 0x63, 0x6b,
	0x61, 0x67, 0x65, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2f, 0x68, 0x65,
	0x6c, 0x6d, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x2b, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70,
	0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x70, 0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73, 0x2e, 0x68,
	0x65, 0x6c, 0x6d, 0x2e, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2e, 0x76, 0x31, 0x61,
	0x6c, 0x70, 0x68, 0x61, 0x31, 0x1a, 0x1c, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x61, 0x70,
	0x69, 0x2f, 0x61, 0x6e, 0x6e, 0x6f, 0x74, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x1a, 0x32, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69,
	0x73, 0x2f, 0x63, 0x6f, 0x72, 0x65, 0x2f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2f,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65,
	0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x30, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70,
	0x73, 0x61, 0x70, 0x69, 0x73, 0x2f, 0x63, 0x6f, 0x72, 0x65, 0x2f, 0x70, 0x6c, 0x75, 0x67, 0x69,
	0x6e, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2f, 0x70, 0x6c, 0x75, 0x67,
	0x69, 0x6e, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x63, 0x2d, 0x67, 0x65, 0x6e, 0x2d, 0x6f, 0x70, 0x65, 0x6e, 0x61, 0x70, 0x69, 0x76, 0x32, 0x2f,
	0x6f, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x2f, 0x61, 0x6e, 0x6e, 0x6f, 0x74, 0x61, 0x74, 0x69,
	0x6f, 0x6e, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x32, 0xf1, 0x05, 0x0a, 0x13, 0x48, 0x65,
	0x6c, 0x6d, 0x50, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63,
	0x65, 0x12, 0xf6, 0x01, 0x0a, 0x1c, 0x47, 0x65, 0x74, 0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62,
	0x6c, 0x65, 0x50, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x69,
	0x65, 0x73, 0x12, 0x48, 0x2e, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69,
	0x73, 0x2e, 0x63, 0x6f, 0x72, 0x65, 0x2e, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x76, 0x61, 0x69,
	0x6c, 0x61, 0x62, 0x6c, 0x65, 0x50, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x53, 0x75, 0x6d, 0x6d,
	0x61, 0x72, 0x69, 0x65, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x49, 0x2e, 0x6b,
	0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x63, 0x6f, 0x72, 0x65,
	0x2e, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68,
	0x61, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x50,
	0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x53, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x69, 0x65, 0x73, 0x52,
	0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x41, 0x82, 0xd3, 0xe4, 0x93, 0x02, 0x3b, 0x12,
	0x39, 0x2f, 0x70, 0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73, 0x2f, 0x68, 0x65, 0x6c, 0x6d, 0x2f, 0x70,
	0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31,
	0x2f, 0x61, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67,
	0x65, 0x73, 0x75, 0x6d, 0x6d, 0x61, 0x72, 0x69, 0x65, 0x73, 0x12, 0xeb, 0x01, 0x0a, 0x19, 0x47,
	0x65, 0x74, 0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x50, 0x61, 0x63, 0x6b, 0x61,
	0x67, 0x65, 0x44, 0x65, 0x74, 0x61, 0x69, 0x6c, 0x12, 0x45, 0x2e, 0x6b, 0x75, 0x62, 0x65, 0x61,
	0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x63, 0x6f, 0x72, 0x65, 0x2e, 0x70, 0x61, 0x63,
	0x6b, 0x61, 0x67, 0x65, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x47,
	0x65, 0x74, 0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x50, 0x61, 0x63, 0x6b, 0x61,
	0x67, 0x65, 0x44, 0x65, 0x74, 0x61, 0x69, 0x6c, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a,
	0x46, 0x2e, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x63,
	0x6f, 0x72, 0x65, 0x2e, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2e, 0x76, 0x31, 0x61,
	0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62,
	0x6c, 0x65, 0x50, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x44, 0x65, 0x74, 0x61, 0x69, 0x6c, 0x52,
	0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x3f, 0x82, 0xd3, 0xe4, 0x93, 0x02, 0x39, 0x12,
	0x37, 0x2f, 0x70, 0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73, 0x2f, 0x68, 0x65, 0x6c, 0x6d, 0x2f, 0x70,
	0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31,
	0x2f, 0x61, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67,
	0x65, 0x64, 0x65, 0x74, 0x61, 0x69, 0x6c, 0x73, 0x12, 0xf2, 0x01, 0x0a, 0x1b, 0x47, 0x65, 0x74,
	0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x50, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65,
	0x56, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x12, 0x47, 0x2e, 0x6b, 0x75, 0x62, 0x65, 0x61,
	0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x63, 0x6f, 0x72, 0x65, 0x2e, 0x70, 0x61, 0x63,
	0x6b, 0x61, 0x67, 0x65, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x47,
	0x65, 0x74, 0x41, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x50, 0x61, 0x63, 0x6b, 0x61,
	0x67, 0x65, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x48, 0x2e, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73,
	0x2e, 0x63, 0x6f, 0x72, 0x65, 0x2e, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2e, 0x76,
	0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x41, 0x76, 0x61, 0x69, 0x6c,
	0x61, 0x62, 0x6c, 0x65, 0x50, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x56, 0x65, 0x72, 0x73, 0x69,
	0x6f, 0x6e, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x40, 0x82, 0xd3, 0xe4,
	0x93, 0x02, 0x3a, 0x12, 0x38, 0x2f, 0x70, 0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73, 0x2f, 0x68, 0x65,
	0x6c, 0x6d, 0x2f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c,
	0x70, 0x68, 0x61, 0x31, 0x2f, 0x61, 0x76, 0x61, 0x69, 0x6c, 0x61, 0x62, 0x6c, 0x65, 0x70, 0x61,
	0x63, 0x6b, 0x61, 0x67, 0x65, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x42, 0x53, 0x5a,
	0x51, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6b, 0x75, 0x62, 0x65,
	0x61, 0x70, 0x70, 0x73, 0x2f, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x2f, 0x63, 0x6d,
	0x64, 0x2f, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x2d, 0x61, 0x70, 0x69, 0x73, 0x2f,
	0x67, 0x65, 0x6e, 0x2f, 0x70, 0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73, 0x2f, 0x68, 0x65, 0x6c, 0x6d,
	0x2f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68,
	0x61, 0x31, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_goTypes = []interface{}{
	(*v1alpha1.GetAvailablePackageSummariesRequest)(nil),  // 0: kubeappsapis.core.packages.v1alpha1.GetAvailablePackageSummariesRequest
	(*v1alpha1.GetAvailablePackageDetailRequest)(nil),     // 1: kubeappsapis.core.packages.v1alpha1.GetAvailablePackageDetailRequest
	(*v1alpha1.GetAvailablePackageVersionsRequest)(nil),   // 2: kubeappsapis.core.packages.v1alpha1.GetAvailablePackageVersionsRequest
	(*v1alpha1.GetAvailablePackageSummariesResponse)(nil), // 3: kubeappsapis.core.packages.v1alpha1.GetAvailablePackageSummariesResponse
	(*v1alpha1.GetAvailablePackageDetailResponse)(nil),    // 4: kubeappsapis.core.packages.v1alpha1.GetAvailablePackageDetailResponse
	(*v1alpha1.GetAvailablePackageVersionsResponse)(nil),  // 5: kubeappsapis.core.packages.v1alpha1.GetAvailablePackageVersionsResponse
}
var file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_depIdxs = []int32{
	0, // 0: kubeappsapis.plugins.helm.packages.v1alpha1.HelmPackagesService.GetAvailablePackageSummaries:input_type -> kubeappsapis.core.packages.v1alpha1.GetAvailablePackageSummariesRequest
	1, // 1: kubeappsapis.plugins.helm.packages.v1alpha1.HelmPackagesService.GetAvailablePackageDetail:input_type -> kubeappsapis.core.packages.v1alpha1.GetAvailablePackageDetailRequest
	2, // 2: kubeappsapis.plugins.helm.packages.v1alpha1.HelmPackagesService.GetAvailablePackageVersions:input_type -> kubeappsapis.core.packages.v1alpha1.GetAvailablePackageVersionsRequest
	3, // 3: kubeappsapis.plugins.helm.packages.v1alpha1.HelmPackagesService.GetAvailablePackageSummaries:output_type -> kubeappsapis.core.packages.v1alpha1.GetAvailablePackageSummariesResponse
	4, // 4: kubeappsapis.plugins.helm.packages.v1alpha1.HelmPackagesService.GetAvailablePackageDetail:output_type -> kubeappsapis.core.packages.v1alpha1.GetAvailablePackageDetailResponse
	5, // 5: kubeappsapis.plugins.helm.packages.v1alpha1.HelmPackagesService.GetAvailablePackageVersions:output_type -> kubeappsapis.core.packages.v1alpha1.GetAvailablePackageVersionsResponse
	3, // [3:6] is the sub-list for method output_type
	0, // [0:3] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_init() }
func file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_init() {
	if File_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   0,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_goTypes,
		DependencyIndexes: file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_depIdxs,
	}.Build()
	File_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto = out.File
	file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_rawDesc = nil
	file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_goTypes = nil
	file_kubeappsapis_plugins_helm_packages_v1alpha1_helm_proto_depIdxs = nil
}
