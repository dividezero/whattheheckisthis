/*------------------------------------------------------------------------------------------*\
Logging lane metrics to help in understanding driver's behavior aka SDLP

\*------------------------------------------------------------------------------------------*/

//#if !defined LINEF
//#define LINEF

#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>

#include <android/log.h>

#define PI 3.1415926

using namespace cv;
using namespace std;

class LaneCalculations {

  private:

	LaneCalculations()//:sumLateralPosition(0), meanLateralPosition(0), countLateralPosition(0)
  	  {
		sumLateralPosition = 0;
		meanLateralPosition = 0;
		countLateralPosition = 0;
		arrayLateralPosition = new double[50000];
       	__android_log_print(ANDROID_LOG_ERROR, "LANE Calculations", "Constructur : %s", "Yes called");

  	  };

	LaneCalculations(LaneCalculations const&){};
	LaneCalculations& operator = (LaneCalculations const&){};
	static LaneCalculations* m_pInstance;



	//	  LineFinder() : deltaRho(1), deltaTheta(PI/180), minVote(10), minLength(0.), maxGap(0.) {}


  public :

	//Mean Lateral Position value
		double sumLateralPosition;
		double meanLateralPosition;
		int countLateralPosition;

		//Standard Deviation of Lateral Position (SDLP)
		double* arrayLateralPosition;

		static LaneCalculations* Instance();

		double calculateMeanLateralPosition();
		double calculateSDLP();








};

//#endif
