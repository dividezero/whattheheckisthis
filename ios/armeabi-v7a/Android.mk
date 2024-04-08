LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

#OpenCv
OPENCV_CAMERA_MODULES:=on
OPENCV_INSTALL_MODULES:=on

include $(OPENCVSDK)/native/jni/OpenCV.mk

LOCAL_MODULE    := LaneDetectionNative
LOCAL_SRC_FILES := LaneDetector.cpp
LOCAL_LDLIBS += -llog -ldl -landroid -lGLESv2 -lEGL 

CPPFLAGS += -fno-strict-aliasing -mfpu=vfp -mfloat-abi=softfp
LOCAL_CPP_FEATURES := rtti exceptions

include $(BUILD_SHARED_LIBRARY)
