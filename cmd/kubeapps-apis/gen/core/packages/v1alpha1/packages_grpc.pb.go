// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package v1alpha1

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// PackagesServiceClient is the client API for PackagesService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type PackagesServiceClient interface {
	GetAvailablePackageSummaries(ctx context.Context, in *GetAvailablePackageSummariesRequest, opts ...grpc.CallOption) (*GetAvailablePackageSummariesResponse, error)
	GetAvailablePackageDetail(ctx context.Context, in *GetAvailablePackageDetailRequest, opts ...grpc.CallOption) (*GetAvailablePackageDetailResponse, error)
}

type packagesServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewPackagesServiceClient(cc grpc.ClientConnInterface) PackagesServiceClient {
	return &packagesServiceClient{cc}
}

func (c *packagesServiceClient) GetAvailablePackageSummaries(ctx context.Context, in *GetAvailablePackageSummariesRequest, opts ...grpc.CallOption) (*GetAvailablePackageSummariesResponse, error) {
	out := new(GetAvailablePackageSummariesResponse)
	err := c.cc.Invoke(ctx, "/kubeappsapis.core.packages.v1alpha1.PackagesService/GetAvailablePackageSummaries", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *packagesServiceClient) GetAvailablePackageDetail(ctx context.Context, in *GetAvailablePackageDetailRequest, opts ...grpc.CallOption) (*GetAvailablePackageDetailResponse, error) {
	out := new(GetAvailablePackageDetailResponse)
	err := c.cc.Invoke(ctx, "/kubeappsapis.core.packages.v1alpha1.PackagesService/GetAvailablePackageDetail", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// PackagesServiceServer is the server API for PackagesService service.
// All implementations should embed UnimplementedPackagesServiceServer
// for forward compatibility
type PackagesServiceServer interface {
	GetAvailablePackageSummaries(context.Context, *GetAvailablePackageSummariesRequest) (*GetAvailablePackageSummariesResponse, error)
	GetAvailablePackageDetail(context.Context, *GetAvailablePackageDetailRequest) (*GetAvailablePackageDetailResponse, error)
}

// UnimplementedPackagesServiceServer should be embedded to have forward compatible implementations.
type UnimplementedPackagesServiceServer struct {
}

func (UnimplementedPackagesServiceServer) GetAvailablePackageSummaries(context.Context, *GetAvailablePackageSummariesRequest) (*GetAvailablePackageSummariesResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAvailablePackageSummaries not implemented")
}
func (UnimplementedPackagesServiceServer) GetAvailablePackageDetail(context.Context, *GetAvailablePackageDetailRequest) (*GetAvailablePackageDetailResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAvailablePackageDetail not implemented")
}

// UnsafePackagesServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to PackagesServiceServer will
// result in compilation errors.
type UnsafePackagesServiceServer interface {
	mustEmbedUnimplementedPackagesServiceServer()
}

func RegisterPackagesServiceServer(s grpc.ServiceRegistrar, srv PackagesServiceServer) {
	s.RegisterService(&PackagesService_ServiceDesc, srv)
}

func _PackagesService_GetAvailablePackageSummaries_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAvailablePackageSummariesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PackagesServiceServer).GetAvailablePackageSummaries(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeappsapis.core.packages.v1alpha1.PackagesService/GetAvailablePackageSummaries",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PackagesServiceServer).GetAvailablePackageSummaries(ctx, req.(*GetAvailablePackageSummariesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PackagesService_GetAvailablePackageDetail_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAvailablePackageDetailRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PackagesServiceServer).GetAvailablePackageDetail(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/kubeappsapis.core.packages.v1alpha1.PackagesService/GetAvailablePackageDetail",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PackagesServiceServer).GetAvailablePackageDetail(ctx, req.(*GetAvailablePackageDetailRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// PackagesService_ServiceDesc is the grpc.ServiceDesc for PackagesService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var PackagesService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "kubeappsapis.core.packages.v1alpha1.PackagesService",
	HandlerType: (*PackagesServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetAvailablePackageSummaries",
			Handler:    _PackagesService_GetAvailablePackageSummaries_Handler,
		},
		{
			MethodName: "GetAvailablePackageDetail",
			Handler:    _PackagesService_GetAvailablePackageDetail_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "kubeappsapis/core/packages/v1alpha1/packages.proto",
}
