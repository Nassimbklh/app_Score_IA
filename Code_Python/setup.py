from setuptools import find_packages, setup

setup(
  name='api',
  version='1.0',
  long_description=__doc__,
  packages=[*find_packages(), '.'],
  include_package_data=True,
  zip_safe=False,
  install_requires=['python-dotenv', 'Flask', 'flask_cors', 'pandas', 'scikit-learn', 'joblib', 'numpy', 'matplotlib', 'seaborn']
)
