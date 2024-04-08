/**
 * Logging lane metrics to help in understanding driver's behavior aka SDLP
 */



#if !defined LINEF
#define LINEF

#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>

#include <android/log.h>

#define PI 3.1415926

using namespace cv;
using namespace std;

class LaneMetrics {

  private:


	 //Mean Lateral Position value
	static double sumLateralPosition;
	static double meanLateralPosition;
	static int countLateralPosition;

	//Standard Deviation of Lateral Position (SDLP)
	static double* arrayLateralPosition;

	LaneMetrics() : sumLater;
	 // LineFinder() : deltaRho(1), deltaTheta(PI/180), minVote(10), minLength(0.), maxGap(0.) {}


  public :

	static LaneMetrics& instance()
	{
		static LaneMetrics INSTANCE;
		return INSTANCE;
	}

	static getSumLaterationPosition
	{
		return sumLateralPosition;
	}




};

#endif
